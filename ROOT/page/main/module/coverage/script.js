class Module {
    DOM() {
        this.listDom = cp.query('.list', DOMAIN);
    }

    EVENT() {
        cp.on('.layer', this.listDom, 'click', t => this.toggleActive(t));
    }

    INIT() {
        this.initList();
    }

    initList() {

    }

    addLayer(data) {
        //增加图层
        let layerHtml = `<div class="layer" id="layer_${data.id}">
                            <div class="num">${data.index}</div>
                            <div class="thumbnail"></div>
                            <div class="name">${data.name}</div>
                        </div>`;
        cp.html(this.listDom, layerHtml, "afterbegin")
    }


    toggleActiveById(id) {
        let layerDom = cp.query("#layer_" + id, this.listDom);
        cp.toggleActive(layerDom)
    }

    toggleActive(target) {
        let idstr = target.id;
        let id = idstr.split("_")[1];
        cp.toggleActive(target);
        MODULE("canvas").toggleActiveById(id);
        MODULE("edit").activeComponentEditById(id);
    }

    removeActiveById(id) {
        let sliceDom = cp.query("#layer_" + id, this.sceneDom);
        cp.removeActive(sliceDom)
    }
}