#!/bin/bash - 
#===============================================================================
#
#          FILE: vue-tester.sh
# 
#         USAGE: ./vue-tester.sh 
# 
#   DESCRIPTION: 
# 
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: Klaus (Chen), klaus_chen@paets.com.tw
#  ORGANIZATION: 
#       CREATED: 2022/01/12 01:12
#      REVISION:  ---
#===============================================================================

set -o nounset                              # Treat unset variables as an error

npm install -g http-server
npm install
npm run build
http-server dist
