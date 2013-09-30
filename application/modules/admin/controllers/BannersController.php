<?php

class Admin_BannersController extends Zend_Controller_Action {
    /*
     * Lista todos os banners cadastrados no sistema
     * e provê as ações necessárias para a manutenção
     * dos dados
     */

    public function indexAction() {
        $banner = new Banner();
        $this->view->banners = $banner->fetchAll();
    }

    /*
     * Desativa um album setando o status do campo
     * ativo com o valor zero
     */

    public function inativarAction() {

        $this->_helper->layout()->disableLayout();
        $this->getHelper('viewRenderer')->setNoRender();

        $banner = new Banner();

        $dados = array(
            'ativo' => 0
        );

        $banner->update($dados, "id = {$this->_getParam('id')}");
        $this->_helper->flashMessenger(array('success' => 'O Banner foi inativado com sucesso!'));
        $this->_redirect('/admin/banners');
    }

    /*
     * Ativa um album setando o status do campo
     * ativo com o valor um (1)
     */

    public function ativarAction() {

        $this->_helper->layout()->disableLayout();
        $this->getHelper('viewRenderer')->setNoRender();

        $banner = new Banner();

        $dados = array(
            'ativo' => 1
        );

        $banner->update($dados, "id = {$this->_getParam('id')}");
        $this->_helper->flashMessenger(array('success' => 'O Banner foi ativado com sucesso!'));
        $this->_redirect('/admin/banners');
    }

    public function deleteAction() {
        $banner = new Banner();
        $atual = $banner->find($this->_getParam('id'))->current();

        try {
            unlink($atual->caminho);
            $atual->delete();
            $this->_helper->flashMessenger(array('success' => 'Banner ' . $atual->nome . ' Excluído com sucesso!'));
            $this->_redirect('/admin/banners');
        } catch (Zend_Db_Exception $exc) {
            $this->_helper->flashMessenger(array('error' => 'Erro ao excluir o banner: ' . $exc->getMessage()));
        }
    }

    /*
     * Adiciona um novo banner no banco de dados
     * e realiza o upload dos arquivos
     */

    public function addAction() {

        if ($this->_request->isPost()) {

            $adapter = new Zend_File_Transfer_Adapter_Http();

            $adapter->setDestination('banners');
            $adapter->addValidator('Extension', false, 'jpg,png,gif');

            $files = $adapter->getFileInfo();
            $post = $this->_request->getPost();

            foreach ($files as $file => $info) {
                if ($adapter->isValid($file)) {

                    $adapter->receive($file);

                    if ($adapter->isReceived($file)) {

                        $data = array(
                            'caminho' => $info['destination'] . "/" . $info['name'],
                            'nome' => $post['nome']
                        );

                        $banner = new Banner();
                        $banner->insert($data);
                    }
                }
            }

            $this->_helper->flashMessenger(array('success' => 'Banner incluído com sucesso!'));
            $this->_redirect('/admin/banners');
        }
    }

}