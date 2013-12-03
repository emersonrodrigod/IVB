<?php

class Admin_NoticiasController extends Zend_Controller_Action {

    public function indexAction() {

        $noticia = new Noticia();
        $this->view->noticias = $noticia->fetchAll();
    }

    public function addAction() {
        if ($this->getRequest()->isPost()) {
            $noticia = new Noticia();
            $dados = $this->getRequest()->getPost();

            try {
                $noticia->insert($dados);
                $this->_helper->flashMessenger(array('success' => 'Cadastro realizado com sucesso!'));
                $this->_redirect("/admin/noticias");
            } catch (Exception $exc) {
                $this->_helper->flashMessenger(array('error' => 'Erro ao gravar os dados : ' . $exc->getMessage()));
            }
        }
    }

    public function editAction() {

        $noticia = new Noticia();
        $atual = $noticia->find(intval($this->_getParam('id')))->current();
        $this->view->noticia = $atual;

        if ($this->getRequest()->isPost()) {

            $dados = $this->getRequest()->getPost();
            try {
                $noticia->update($dados, "id = {$atual->id}");
                $this->_helper->flashMessenger(array('success' => 'Dados atualizados com sucesso!'));
                $this->_redirect("/admin/noticias");
            } catch (Exception $exc) {
                $this->_helper->flashMessenger(array('error' => 'Erro ao gravar os dados : ' . $exc->getMessage()));
            }
        }
    }

    public function deleteAction() {
        $noticia = new Noticia();
        $atual = $noticia->find($this->_getParam('id'))->current();

        try {
            $atual->delete();
            $this->_helper->flashMessenger(array('success' => 'Noticia ' . $atual->titulo . ' Excluído com sucesso!'));
            $this->_redirect('/admin/noticias');
        } catch (Zend_Db_Exception $exc) {
            $this->_helper->flashMessenger(array('error' => 'Erro ao excluir o noticia: ' . $exc->getMessage()));
        }
    }

}
