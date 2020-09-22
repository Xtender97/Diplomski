#include <stdio.h>
int P1(int *a)
    {
        ++*a;
        return 4;
    }
int P2(int *b)
    {
        while ((*b)--);
        return 3;
    }
int P3(int *c) { return *c += 6; }
typedef int (*f)(int *);

void main()
{
    f niz[] = {P1, P2, P3, P3, P1, P2};
    int broj = 5;
    int n = sizeof(niz) / sizeof(f);
    char i = '0', a;
    while (i < n)
    {
        i = (a = niz[i % n](&i), i + a);
        printf("%d", i);
    }
}
