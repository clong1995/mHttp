class Module {
    DOM() {
        this.listDom = cp.query('.list', DOMAIN);
    }

    EVENT() {
        cp.on('.layer', this.listDom, 'focus', t => this.focusLayer(t));
        cp.on('.layer', this.listDom, 'blur', t => this.blurLayer(t));
    }

    INIT() {
        this.initList();
    }

    initList() {

    }

    addLayer(id, index) {
        //增加一片
        let layerHtml = `<div class="layer" id="layer_${id}" tabindex="-1">
                            <div class="num">${index}</div>
                            <div class="thumbnail"></div>
                            <div class="name">柱状图</div>
                        </div>`;
        cp.html(this.listDom, layerHtml, "beforeend")
    }

    addActiveLayer(id) {
        let layerDom = cp.query("#layer_" + id, this.listDom);
        cp.addActive(layerDom)
    }

    removeActiveLayer(id) {
        let layerDom = cp.query("#layer_" + id, this.listDom);
        cp.removeActive(layerDom)
    }

    focusLayer(target) {
        let id = target.id.split("_")[1];
        cp.toggleActive(target);
        MODULE("canvas").toggleActive(id);
    }

    blurLayer(target) {
        let id = target.id.split("_")[1];
        cp.removeActive(target);
        MODULE("canvas").removeActiveSlice(id);
    }
}