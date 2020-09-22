// JUN 2019 (A)* 13 9 21 B) 16 8 20 C) 15 9 21
#include <stdio.h>
int main(void)
{
    int a[] = {3, 11, 6, 19};
    int n = a[0];
    for (int i = 1; i <= n; i++)
    {
        int r = a[i] & -a[i];
        int x = a[i] + r;
        int ones = x ^ a[i];
        ones /= r;
        ones >>= 2;
        a[i] = x ^ ones;
    }
    for (int i = 1; i <= n; i++)
        printf("%d ", a[i]);
}

// FEBRUAR 2020 - (A)* a a b bbb cab c B)A A B Bbb Cab C C)aabbbbcabc
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
char *transform(char *);
int main()
{
    char *old = "AABBbbCabC\0";
    char *new = transform(old);
    printf("%s", new);
    free(new);
    return 0;
}
char *transform(char *s)
{
    int i = 0, j = 0;
    char *new_str = malloc(strlen(s) * 2), ch;
    while (s[i] != '\0')
    {
        ch = s[i];
        if (isupper(ch))
        {
            if (i > 0)
                new_str[j++] = ' ';
            ch = tolower(ch);
        }
        new_str[j++] = ch;
        i++;
    }
    new_str[j] = '\0';
    return new_str;
}

// JUL 2020 - (A)* 2 B) 1 C) 0

#include <stdio.h>
int main()
{
    int arr[] = {1, 0x12, 21, 03, 011, 10};
    int n = sizeof(arr) / sizeof(*arr),
        k = 1, c = 0;
    for (int i = 0; i < n; i++)
    {
        int s = 0;
        for (int j = -k, ind; j <= k; j++)
        {
            ind = i - j;
            if (ind < 0)
                ind += n;
            else if (ind >= n)
                ind -= n;
            if (ind == i)
                continue;
            s += arr[ind];
        }
        c += s == arr[i];
    }
    printf("%d", c);
    return 0;
}


// AVGUST 2020 = (A) *okok
//                  asl
//                  se

#include <stdio.h>
#include <string.h>
#define MAX 10
int main()
{
    char str[][MAX] = {"kokoska", "slama", "selo", ""};
    char *p[sizeof(str) / sizeof(*str)];
    char *q, *r;
    for (int i = 0, j; j = strlen(str[i]); i++)
    {
        p[i] = str[i];
        q = str[i] + (j + 1) / 2;
        r = q;
        while (*q && strncmp(str[i], r, (j + 1) / 2))
        {
            *q++ = *p[i]++;
        }
        printf("%s\n", p[i]);
    }
    return 0;
}

// SEP 2020-  A) 5 81 0 7 (B)* 5 c9 1a 7 C) 82 f0 c1 6
#include <stdio.h>
#define MAX 5
#define BITS 8
int main()
{
    unsigned char arr[MAX] = {0xa, 071, 13, 7};
    unsigned char mask, shift;
    for (int i = 0; i < MAX - 1; i++)
    {
        shift = arr[i + 1] % BITS;
        if (shift)
        {
            mask = (1 << shift) - 1;
            arr[i] = (arr[i] & mask) << (BITS - shift) | (arr[i] >> shift);
        }
    }
    for (int i = 0; i < MAX - 1; i++)
        printf("%x ", arr[i]);
    return 0;
}

// SEP 2020 - A)0 1 2 4 5 6 (B) 0 2 2 4 5 6 C)1 1 3 3 5 5

#include <stdio.h>
#define DIM 2
void foo(int (*ptr)[DIM], int cnt)
{
    int(*qtr)[DIM] = ptr + cnt;
    while (ptr <= --qtr)
        (*ptr++[0])--;
}
int main()
{
    int vals[][DIM] = {1, 2, 3, 4, 5, 6},
        cnt = sizeof(vals) / (sizeof(int) * DIM);
    foo(vals, cnt);
    for (int i = 0; i < cnt; i++)
        printf("%d %d ", vals[i][0], vals[i][1]);
    return 0;
}

// SEP 2019 - A)4 5 9 17 6 11 (B)* 9 4 5 6 17 11 C)9 4 5 6 11 17

#include <stdio.h>
void preuredi2(int arr[], int n)
{
    if (n <= 1)
        return;
    preuredi2(arr, n - 1);
    int k = arr[n - 1];
    int j = n - 2;
    while (j >= 0 && arr[j] > k)
    {
        arr[j + 1] = arr[j];
        j--;
    }
    arr[j + 1] = k;
}
void ispisi(int arr[], int n)
{
    int i;
    for (i = 0; i < n; ++i)
        printf("%d ", arr[i]);
}
int main()
{
    int arr[] = {9, 4, 17, 5, 6, 11};
    int n = sizeof(arr) / sizeof(arr[0]);
    preuredi2(arr + 2, n / 2);
    ispisi(arr, n);
}

// JUL 2019 - A)* 2 3 7 5 6 16 B) 2 3 7 5 16 6 C) 2 7 3 5 6 16
#include <stdio.h>
typedef int (*FP)(int *);
int f1(int *a)
{
    ++*a;
    return 2;
}
int f2(int *a)
{
    int x = a[0];
    a[0] = a[-1];
    a[-1] = x;
    return 0;
}
int f3(int a[])
{
    a[0] += a[1] + a[-1];
    return 1;
}
int main()
{
    int a[] = {1, 2, 3, 4, 5, 6}, next = 0;
    int n = sizeof(a) / sizeof(int);
    FP f[] = {f1, f2, f3};
    for (int i = 0; i < n; i++)
        next = f[next](a + i);
    for (int i = 0; i < n; i++)
        printf("%d ", a[i]);
    return 0;
}

// POPRAVNI KLK 2019 - (A)* 13 9 21 B) 16 8 20 C) 15 9 21

#include <stdio.h>
int main(void)
{
    int a[] = {3, 11, 6, 19};
    int n = a[0];
    for (int i = 1; i <= n; i++)
    {
        int r = a[i] & -a[i];
        int x = a[i] + r;
        int ones = x ^ a[i];
        ones /= r;
        ones >>= 2;
        a[i] = x ^ ones;
    }
    for (int i = 1; i <= n; i++)
        printf("%d ", a[i]);
}

// JUN 2019 - (A) *dginnogd B) dinggnod C) ddionngg

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
char *foo(char *s1, char *s2)
{
    int d1 = strlen(s1), d2 = strlen(s2);
    char *res = malloc(d1 + d2 + 1);
    for (char *p = res; *p++ = *s1++; p++)
        *p = *(s2 + --d2);
    return res;
}
int main(void)
{
    char *s1 = "ding";
    char *s2 = "dong";
    //  char *r = foo(s1, s2);
    // printf("%s", r);
    // free(r);
}

// JUN 2019 = (A)* 1 2 3 4 5 8 0 0 B) 1 2 2 3 3 4 5 8 C) 2 3 5 8 1 2 3 4

#include <stdio.h>
#include <stdlib.h>
int step(int a, int b, int *ind_a, int *ind_b)
{
    if (a < b)
    {
        (*ind_a)++;
        return a;
    }
    else if (a > b)
    {
        (*ind_b)++;
        return b;
    }
    else
    {
        (*ind_a)++, (*ind_b)++;
        return a;
    }
}
void process(int *arr1, int *arr2, int **res, int n)
{
    int i, j, k;
    *res = calloc(2 * n, sizeof(int));
    for (i = 0, j = 0, k = 0; i < n && j < n; k++)
        (*res)[k] = step(arr1[i], arr2[j], &i, &j);
    for (; i < n; (*res)[k++] = arr1[i++])
        ;
    for (; j < n; (*res)[k++] = arr2[j++])
        ;
}
int main()
{
    int arr1[] = {2, 3, 5, 8},
        arr2[] = {1, 2, 3, 4}, *res, n;
    n = sizeof(arr1) / sizeof(*arr1);
    process(arr1, arr2, &res, n);
    for (int i = 0; i < 2 * n;
         printf("%d ", res[i++]))
        ;
    free(res);
}

// FEBRAUR 2019 - (®)* 31 2 2 1 ®)20 1 1 2 ®)2 1 1 19

#include <stdio.h>
void main()
{
    int i, k = 3, arr[] = {30, 1, 19};
    int *ptrk = &k;
    int *arrptr[] =
        {arr + 1, &k, ptrk, &arr[2]};
    int(*ptrarr)[3] = &arr;
    (*ptrarr)[0]++;
    *arrptr[2] = 2;
    *(arrptr + 3) = arr;
    for (i = sizeof(arrptr) / sizeof(int *) - 1;
         i >= 0; i--)
        printf("%d ", *arrptr[i]);
}