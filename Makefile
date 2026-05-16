PORT ?= 8000

.PHONY: serve open live stop clean

serve:
	@echo "Serving on http://localhost:$(PORT)  (Ctrl-C to stop)"
	@python3 -m http.server $(PORT) --bind 127.0.0.1

live:
	@command -v npx >/dev/null || (echo "npx not installed"; exit 1)
	@npx --yes live-server --port=$(PORT) --no-browser --quiet

open:
	@xdg-open http://localhost:$(PORT) >/dev/null 2>&1 || true

clean:
	@rm -rf .cache node_modules
