<?php

class Admin_UsuariosController extends Zend_Controller_Action {

    public function indexAction() {
        $usuario = new Usuario();
        $this->view->usuarios = $usuario->fetchAll();
    }

    public function addAction() {
        if ($this->getRequest()->isPost()) {
            $usuario = new Usuario();
            $dados = $this->getRequest()->getPost();

            try {

                $dados['senha'] = sha1($dados['senha']);

                $usuario->insert($dados);
                $this->_helper->flashMessenger(array('success' => 'Cadastro realizado com sucesso!'));
                $this->_redirect("/admin/usuarios");
            } catch (Exception $exc) {
                $this->_helper->flashMessenger(array('error' => 'Erro ao gravar os dados : ' . $exc->getMessage()));
            }
        }
    }

    public function editAction() {

        $usuario = new Usuario();
        $atual = $usuario->find(intval($this->_getParam('id')))->current();
        $this->view->usuario = $atual;

        if ($this->getRequest()->isPost()) {

            $dados = $this->getRequest()->getPost();
            try {
                $usuario->update($dados, "id = {$atual->id}");
                $this->_helper->flashMessenger(array('success' => 'Dados atualizados com sucesso!'));
                $this->_redirect("/admin/usuarios");
            } catch (Exception $exc) {
                $this->_helper->flashMessenger(array('error' => 'Erro ao gravar os dados : ' . $exc->getMessage()));
            }
        }
    }

    public function inativarAction() {

        $this->_helper->layout()->disableLayout();
        $this->getHelper('viewRenderer')->setNoRender();

        $usuario = new Usuario();

        $dados = array(
            'ativo' => 0
        );

        $usuario->update($dados, "id = {$this->_getParam('id')}");
        $this->_helper->flashMessenger(array('success' => 'O Usuario foi inativado com sucesso!'));
        $this->_redirect('/admin/usuarios');
    }

    public function ativarAction() {

        $this->_helper->layout()->disableLayout();
        $this->getHelper('viewRenderer')->setNoRender();

        $usuario = new Usuario();

        $dados = array(
            'ativo' => 1
        );

        $usuario->update($dados, "id = {$this->_getParam('id')}");
        $this->_helper->flashMessenger(array('success' => 'O usuario foi ativado com sucesso!'));
        $this->_redirect('/admin/usuarios');
    }

    public function deleteAction() {
        $usuario = new Usuario();
        $atual = $usuario->find($this->_getParam('id'))->current();

        try {
            $atual->delete();
            $this->_helper->flashMessenger(array('success' => 'Usuario ' . $atual->nome . ' Excluído com sucesso!'));
            $this->_redirect('/admin/usuarios');
        } catch (Zend_Db_Exception $exc) {
            $this->_helper->flashMessenger(array('error' => 'Erro ao excluir o usuario: ' . $exc->getMessage()));
        }
    }

}