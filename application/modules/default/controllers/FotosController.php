<?php

class Default_FotosController extends Zend_Controller_Action {
    /*
     * Lista todos os albuns
     */

    public function indexAction() {

        $album = new Album();
        $this->view->albuns = $album->fetchAll();
    }

    /*
     * Lista as fotos de um album específico
     */

    public function visualizarAction() {

        $album = new Album();
        $atual = $album->find(intval($this->_getParam('id')))->current();
        $fotos = $atual->findDependentRowset('AlbumFotos');

        $this->view->fotos = $fotos;
        $this->view->album = $atual;
    }

}