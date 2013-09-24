<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap {

    protected function _initAutoLoader() {
        $autoLoader = Zend_Loader_Autoloader::getInstance();
        $autoLoader->setFallbackAutoloader(true); //Loader de todas as classes
    }

    protected function _initPlugins() {
        $bootstrap = $this->getApplication();

        if ($bootstrap instanceof Zend_Application) {
            $bootstrap = $this;
        }

        $bootstrap->bootstrap('FrontController');
        $front = $bootstrap->getResource('FrontController');
        $front->registerPlugin(new My_Plugins_Layout());
        //$front->registerPlugin(new My_Plugins_CheckAcl());
    }

}

