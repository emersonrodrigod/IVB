<?php

class Admin_AuthController extends Zend_Controller_Action {

    public function init() {
        
    }

    public function indexAction() {
        $this->_helper->layout->disableLayout();

        if ($this->_request->isPost()) {
            $data = $this->_request->getPost();
            $authAdapter = $this->getAuthAdapter();
            $authAdapter->setIdentity($data['email'])
                    ->setCredential($data['senha']);

            $result = $authAdapter->authenticate();

            if ($result->isValid()) {
                $auth = Zend_Auth::getInstance();
                //separando a sessão do admin da sessão do frontend
                $auth->setStorage(new Zend_Auth_Storage_Session("sessao"));
                $dataAuth = $authAdapter->getResultRowObject(null, 'senha');
                $auth->getStorage()->write($dataAuth);
                $this->_redirect("/admin/index");
            } else {
                $this->_helper->flashMessenger(array('error' => 'Erro ao excluir o banner:'));
                $this->_redirect("/admin/index");
            }
        }
    }

    public function logoutAction() {
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout->disableLayout();
        $auth = Zend_Auth::getInstance();
        $auth->setStorage(new Zend_Auth_Storage_Session('sessao'));
        $auth->clearIdentity();
        $this->_redirect('/admin/auth');
    }

    private function getAuthAdapter() {
        $bootstrap = $this->getInvokeArg('bootstrap');
        $resource = $bootstrap->getPluginResource("db");
        $db = $resource->getDbAdapter();

        $authAdapter = new Zend_Auth_Adapter_DbTable($db);
        $authAdapter->setTableName('usuario')
                ->setIdentityColumn('email')
                ->setCredentialColumn('senha')
                ->setCredentialTreatment('sha1(?)');
        return $authAdapter;
    }

    public function esqueciAction() {

        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout->disableLayout();

        if ($this->_request->isPost()) {

            $dados = $this->_request->getPost();

            $usuario = new Usuario();
            $atual = $usuario->getByEmail($dados['email']);

            if (isset($atual->id)) {

                $util = new Util();
                $senha = $util->geraSenha(8, true, true);
                $dados = array('senha' => sha1($senha));

                $usuario->update($dados, "id = {$atual->id}");

                $body = '<h2>Olá ' . $atual->nome . '! </h2>';
                $body .= '<p>Anote sua nova senha para entrar no painel administrativo de seu site:</p>';
                $body .= '<p><strong>' . $senha . '</strong></p>';

                $util->sendMail('emersonrodrigod@gmail.com', 'Emerson', 'emersonrodrigod@gmail.com', 'Lembrete de senha site IVB', $body);

                echo '<script>
                        alert("Uma nova Senha foi enviada para seu e-mail! Dentro de alguns minutos deve recebe-la.");
                        location.href="/admin/auth";
                      </script>';
            } else {
                echo '<script>
                        alert("E-mail nao cadastrado em nosso banco de dados!");
                        location.href="/admin/auth";
                      </script>';
            }
        }
    }

}

