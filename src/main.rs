use actix_files as fs;
use actix_files::NamedFile;
use actix_http::{body::Body, Response};
use actix_web::dev::ServiceResponse;
use actix_web::http::StatusCode;
use actix_web::middleware::errhandlers::{ErrorHandlerResponse, ErrorHandlers};
use actix_web::{error, middleware, web, App, Error, HttpResponse, HttpServer, Result};
use tera::Tera;

async fn index(tmpl: web::Data<tera::Tera>) -> Result<HttpResponse, Error> {
    let s = tmpl
        .render("index.html", &tera::Context::new())
        .map_err(|err| error::ErrorInternalServerError(err.to_string()))?;
    Ok(HttpResponse::Ok().content_type("text/html").body(s))
}

async fn index2(
    tmpl: web::Data<tera::Tera>,
    info: web::Path<String>,
) -> Result<HttpResponse, Error> {
    let s = tmpl
        .render(&(info.replace("-", "_") + ".html"), &tera::Context::new())
        .map_err(|err| error::ErrorInternalServerError(err.to_string()))?;
    Ok(HttpResponse::Ok().content_type("text/html").body(s))
}

async fn robots() -> Result<NamedFile> {
    Ok(NamedFile::open("robots.txt")?)
}

async fn sitemap() -> Result<NamedFile> {
    Ok(NamedFile::open("sitemap.xml")?)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    std::env::set_var("RUST_LOG", "actix_web=info");
    env_logger::init();

    println!("Listening on: 127.0.0.1:8000, open browser and visit have a try!");

    HttpServer::new(|| {
        let tera = Tera::new(concat!(env!("CARGO_MANIFEST_DIR"), "/templates/**/*")).unwrap();

        App::new()
            .data(tera)
            .wrap(middleware::Logger::default()) // enable logger
            .service(web::resource("/").route(web::get().to(index)))
            .service(web::resource("/robots.txt").route(web::get().to(robots)))
            .service(web::resource("/sitemap.xml").route(web::get().to(sitemap)))
            .service(web::resource("/{name}").route(web::get().to(index2)))
            .service(
                fs::Files::new("/static", "static/")
                    .show_files_listing()
                    .use_last_modified(true),
            )
            .service(web::scope("").wrap(error_handlers()))
    })
    .bind("127.0.0.1:8000")?
    .run()
    .await
}

// Custom error handlers, to return HTML responses when an error occurs.
fn error_handlers() -> ErrorHandlers<Body> {
    ErrorHandlers::new().handler(StatusCode::NOT_FOUND, not_found)
}

// Error handler for a 404 Page not found error.
fn not_found<B>(res: ServiceResponse<B>) -> Result<ErrorHandlerResponse<B>> {
    let response = get_error_response(&res, "Page not found");
    Ok(ErrorHandlerResponse::Response(
        res.into_response(response.into_body()),
    ))
}

// Generic error handler.
fn get_error_response<B>(res: &ServiceResponse<B>, error: &str) -> Response<Body> {
    let request = res.request();

    // Provide a fallback to a simple plain text response in case an error occurs during the
    // rendering of the error page.
    let fallback = |e: &str| {
        Response::build(res.status())
            .content_type("text/plain")
            .body(e.to_string())
    };

    let tera = request.app_data::<web::Data<Tera>>().map(|t| t.get_ref());
    match tera {
        Some(tera) => {
            let mut context = tera::Context::new();
            context.insert("error", error);
            context.insert("status_code", res.status().as_str());
            let body = tera.render("error.html", &context);

            match body {
                Ok(body) => Response::build(res.status())
                    .content_type("text/html")
                    .body(body),
                Err(_) => fallback(error),
            }
        }
        None => fallback(error),
    }
}
