#
#	You need to have an SSH key on the app. Or password
# 	TEST APP PORT 13644
# 	PRODUCTION APP PORT 13664
#

BASEDIR=$(shell pwd)
DESTINATIONMACHINE=node-13.rosti.cz
DESTINATIONPORT=13664
DESTINATIONDIR=/srv/app/
DESTINATIONUSER=app
NAME=knihovna
VERSION=0.3
NODE_BIN_PATH=${BASEDIR}/node_modules/.bin/
BIN_PATH=${BASEDIR}/target/release/rust-knihovna

.PHONY: all build upload clean

build:
	#${NODE_BIN_PATH}stylus -c ${BASEDIR}/static/css/style.styl -o ${BASEDIR}/static/css/style.css
	RUSTFLAGS='-C link-arg=-s' cargo build --release --target x86_64-unknown-linux-musl
	cp target/x86_64-unknown-linux-musl/release/rust-knihovna .
	#upx --brute ${BIN_PATH}

upload: build
	git commit -am "init"
	git push
	ssh knihovna "cd /srv/app/rust-knihovna && git pull && supervisorctl restart rust-knihovna"
	#rsync -avz --exclude=".*" --delete -e "ssh knihovna" ${BASEDIR}/ ${DESTINATIONDIR}


clean:
	rm -rf ${BASEDIR}/site

all: build upload
