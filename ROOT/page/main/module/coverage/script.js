class Module {
    DOM() {
        this.listDom = cp.query('.list', DOMAIN);
    }

    EVENT() {
        cp.on('.layer', this.listDom, 'click', t => this.toggleActive(t));
        cp.on('.layer', this.listDom, 'change', (t1, t2) => this.changeLayer(t1, t2));
    }

    INIT() {
        this.initList();
    }

    initList() {

    }

    changeLayer(target1, target2) {
        let id = target1.id.split("_")[1];
        let componentData = this.APP.getComponentData(id);

        if (cp.hasClass(target2, "name")) {
            let value = target2.value;
            componentData["nickname"] = value;
            if (!value) {
                target2.value = componentData.title
            }
        }
    }

    addLayer(data) {
        //增加图层
        let layerHtml = `<div class="layer" id="layer_${data.id}">
                            <div class="num">${data.index}</div>
                            <div class="thumbnail"></div>
                            <input class="name" value="${data.nickname || data.title}"/>
                        </div>`;
        cp.html(this.listDom, layerHtml, "afterbegin")
    }


    toggleActiveById(id) {
        let layerDom = cp.query("#layer_" + id, this.listDom);
        cp.toggleActive(layerDom)
    }

    toggleActive(target) {
        let id = target.id.split("_")[1];
        cp.toggleActive(target);
        MODULE("canvas").toggleActiveById(id);
        MODULE("edit").activeComponentEditById(id);
    }

    removeActiveById(id) {
        let sliceDom = cp.query("#layer_" + id, this.sceneDom);
        cp.removeActive(sliceDom)
    }

    setName(id) {
        let componentData = this.APP.getComponentData(id);
        let layerDom = cp.query("#layer_" + id, this.listDom);

        cp.html(cp.query(".name", layerDom), componentData.title)
    }
}