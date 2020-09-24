#include <stdio.h>
#include <stdlib.h>
void main(int argc, char *argv[]) {
    int i, cnt, x, y;
    for (i = 0; i < argc - 2; ) {
        cnt = 0;
        y = atoi(argv[++i]);
        if(y<0) x = ~y;
        else x = y;
        while(x) {
            x &= (x-1);
            cnt++;
        }
        if(cnt%2) printf("%d ", y);
    }
}