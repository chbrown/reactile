BIN := node_modules/.bin
TYPESCRIPT := $(shell jq -r '.files[]' tsconfig.json | grep -Fv .d.ts)
TYPESCRIPT_BASENAMES := $(basename $(TYPESCRIPT))
JAVASCRIPT := $(TYPESCRIPT_BASENAMES:%=%.js)
DECLARATIONS := $(TYPESCRIPT_BASENAMES:%=%.d.ts)

all: $(JAVASCRIPT) .npmignore .gitignore

$(BIN)/webpack $(BIN)/tsc:
	npm install

.npmignore: tsconfig.json
	echo Makefile tsconfig.json $(TYPESCRIPT) | tr ' ' '\n' > $@

.gitignore: tsconfig.json
	echo $(JAVASCRIPT) $(DECLARATIONS) | tr ' ' '\n' > $@

%.js: %.ts $(BIN)/tsc
	$(BIN)/tsc -d

%.js: %.tsx $(BIN)/tsc
	$(BIN)/tsc -d
