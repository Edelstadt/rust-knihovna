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

.PHONY: all build upload clean

build:
	stylus ${BASEDIR}/templates/css/style.styl -o ${BASEDIR}/templates/css/style.css
	#cp ${BASEDIR}/css-dist/* ${BASEDIR}/templates/
	find ${BASEDIR}/templates/css/ -type f -name '*.min.min.css' -delete
	css-minify -d templates/css/
	cp ${BASEDIR}/css-dist/* ${BASEDIR}/templates/css
	find ${BASEDIR}/templates/css/ -type f -name '*.min.min.css' -delete
	go build -o ${BASEDIR}/test ${BASEDIR}/main.go
	upx --brute ${BASEDIR}/test

upload: build

	rsync -avz --exclude=".*" --delete -e "ssh knihovna" ${BASEDIR}/ ${DESTINATIONDIR}


clean:
	rm -rf ${BASEDIR}/site

all: build upload
