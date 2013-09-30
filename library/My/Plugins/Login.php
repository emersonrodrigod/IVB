<?php

class My_Plugins_Login extends Zend_Controller_Plugin_Abstract {

    public function dispatchLoopStartup(Zend_Controller_Request_Abstract $request) {
        $action = $request->getActionName();
        $module = $request->getModuleName();

        if ($module <> "default" && $action <> "esqueci") {
            if (!Zend_Auth::getInstance()->setStorage(new Zend_Auth_Storage_Session("sessao"))->hasIdentity()) {
                $request->setControllerName("auth")
                        ->setActionName("index");
            }
        }
    }

}