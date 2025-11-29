NAME=window-navigator
DOMAIN=birgersp.no

TS_SRCS := $(shell find src -name '*.ts')

.PHONY: all pack install clean

all: out/.tsc-stamp

node_modules/.install-stamp: package.json
	yarn install
	@touch $@

out/.tsc-stamp: node_modules/.install-stamp $(TS_SRCS)
	yarn run build
	@touch $@

schemas/gschemas.compiled: schemas/org.gnome.shell.extensions.$(NAME).gschema.xml
	glib-compile-schemas schemas

$(NAME).zip: out/.tsc-stamp schemas/gschemas.compiled
	@mkdir -p dist
	@cp -r -t dist out/*
	@cp -r schemas dist/
	@cp metadata.json dist/
	@(cd dist && zip ../$(NAME).zip -9r .)

pack: $(NAME).zip

install: $(NAME).zip
	gnome-extensions install --force $(NAME).zip

clean:
	@rm -rf dist node_modules $(NAME).zip
