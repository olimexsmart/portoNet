<?php

function openDoor()
{
/*  // Valid if on RaspberryPi
    system("gpio mode 1 out");
    system("gpio write 1 1");
    sleep(1);
    system("gpio write 1 0");
*/

  // Valid for custom Arduino board
  //file_get_contents("http://192.168.1.33/open");

  // Valid for HomeAssistant
  require 'login.php';
  shell_exec($curlOpen);
}
