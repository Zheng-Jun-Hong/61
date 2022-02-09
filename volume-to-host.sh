#!/bin/bash - 
#===============================================================================
#
#          FILE: npm-insteller.sh
# 
#         USAGE: ./npm-insteller.sh 
# 
#   DESCRIPTION: 
# 
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: Klaus (Chen), klaus_chen@paets.com.tw
#  ORGANIZATION: 
#       CREATED: 2022/01/11 20:49
#      REVISION:  ---
#===============================================================================

set -o nounset                              # Treat unset variables as an error

npm install
npm run build
cp -r ./dist/* ./volume-to-host
tail -f /dev/null
