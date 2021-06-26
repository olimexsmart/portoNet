<?php

function openDoor()
{
    system("gpio mode 1 out");
    system("gpio write 1 1");
    sleep(1);
    system("gpio write 1 0");
}
