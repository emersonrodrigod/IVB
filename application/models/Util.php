<?php

class Util {

    /**
     * Função para gerar senhas aleatórias
     *
     * @author Emerson Dário
     *
     * @param integer $tamanho Tamanho da senha a ser gerada
     * @param boolean $maiusculas Se terá letras maiúsculas
     * @param boolean $numeros Se terá números
     * @param boolean $simbolos Se terá símbolos
     *
     * @return string A senha gerada
     */
    public function geraSenha($tamanho = 8, $maiusculas = true, $numeros = true, $simbolos = false) {
        $lmin = 'abcdefghijklmnopqrstuvwxyz';
        $lmai = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $num = '1234567890';
        $simb = '!@#$%*-';
        $retorno = '';
        $caracteres = '';

        $caracteres .= $lmin;
        if ($maiusculas)
            $caracteres .= $lmai;
        if ($numeros)
            $caracteres .= $num;
        if ($simbolos)
            $caracteres .= $simb;

        $len = strlen($caracteres);
        for ($n = 1; $n <= $tamanho; $n++) {
            $rand = mt_rand(1, $len);
            $retorno .= $caracteres[$rand - 1];
        }
        return $retorno;
    }

    public function sendMail($fromMail, $fromName, $to, $subject, $body) {
        $config['auth'] = 'login';
        $config['username'] = 'emersonrodrigod@gmail.com';
        $config['password'] = 'forebaforeba090189';
        $config['ssl'] = 'ssl';
        $config['port'] = '465';

        $smtp = new Zend_Mail_Transport_Smtp("smtp.gmail.com", $config);

        $mail = new Zend_Mail('UTF-8');

        $mail->setFrom($fromMail, $fromName)
                ->addTo($to, $to)
                ->setBodyHtml($body)
                ->setSubject($subject)
                ->send($smtp);
    }

}
