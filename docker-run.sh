#!/bin/bash
npm install -g npm;
npm install tsd -g
npm install definition-header -g
npm install bem-cn
tsd reinstall
tsd rebundle
tsd install
npm install
npm start
