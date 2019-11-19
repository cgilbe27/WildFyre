<?php

/**
 * Linting for TypeScript files with "tslint"
 */
 final class TSLint extends ArcanistExternalLinter {

   public function getInfoName() {
     return 'TSLint';
   }

   public function getInfoURI() {
     return 'https://palantir.github.io/tslint/';
   }

   public function getInfoDescription() {
     return pht(
       'TSLint is an extensible static analysis tool that checks TypeScript'.
       'code for readability, maintainability, and functionality errors.');
   }

   public function getLinterName() {
     return 'TSLint';
   }

   public function getLinterConfigurationName() {
     return 'tslint';
   }

   public function getDefaultBinary() {
     return 'tslint';
   }

   public function getVersion() {
     list($stdout) = execx('%C --version', $this->getExecutableCommand());

     $matches = array();
     if (preg_match('/^(?P<version>\d+\.\d+(?:\.\d+)?)\b/', $stdout, $matches)) {
       return $matches['version'];
     } else {
       return false;
     }
   }

   public function getInstallInstructions() {
     return pht('Install TSLint using `%s`.', 'npm install tslint typescript -g');
   }

   protected function getMandatoryFlags() {
     return array(
       '--format', 'json'
     );
   }

   protected function parseLinterOutput($path, $err, $stdout, $stderr) {
     $json = json_decode($stdout, true);

     $messages = array();
     foreach ($json as $match) {
       $message = new ArcanistLintMessage();
       $message->setPath($path);
       $message->setLine($match['startPosition']['line'] + 1);
       $message->setChar($match['startPosition']['character'] + 1);
       $message->setCode($match['ruleName']);
       $message->setName('TSLint '.$match['ruleName']);
       $message->setDescription($match['failure']);
       $message->setSeverity($this->getLintMessageSeverity($match['ruleName']));

       $messages[] = $message;
     }

     return $messages;
   }
 }
