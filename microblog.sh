#!/bin/sh

NODE_ENV=production
CMD="node cluster.js"
NAME=Microblog
PIDFILE="pid"

case "$1" in
  start)
    echo "Starting $NAME:"
    nohup $CMD > /dev/null &
    echo $! > $PIDFILE
    echo "ok."
    ;;
  stop)
    echo "Stopping $NAME:"
    pid=`cat $PIDFILE`
    kill $pid
    rm $PIDFILE
    echo "ok."
    ;;
esac

exit 0
