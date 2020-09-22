// JUN 2020 - (A) aary B) aray C) aayr
// INPUT arya
#include <stdio.h>
#include <string.h>
#define MAX 10
void fun(char *str, char *q)
{
    char *p = str, *r = q - 1, t;
    if (q - p <= 0)
        return;
    while (1)
    {
        while (*p < *q)
            p++;
        while (r > p && *r >= *q)
            r--;
        if (p < r)
        {
            t = *p;
            *p = *r;
            *r = t;
        }
        else
            break;
    }
    t = *q;
    *q = *p;
    *p = t;
    fun(str, p - 1);
    fun(p + 1, q);
}
int main(void)
{
    char s[MAX];
    scanf("%s", s);
    fun(s, s + strlen(s) - 1);
    printf("%s", s);
}

// SEP 2019 (A)* 5 B) 3 C) 8
// INPUT 4 4

#include <stdio.h>
#include <stdlib.h>
int **alloc(int *m, int *n)
{
    scanf("%d%d", m, n);
    int **mat = malloc(*m * sizeof(*mat));
    for (int i = 0; i < *m; i++)
    {
        mat[i] = malloc(*n * sizeof(**mat));
        for (int j = 0; j < *n; j++)
            mat[i][j] = i == 0 || j == 0 ? 0 : (i + j) % *m;
    }
    return mat;
}
void dealloc(int **mat, int m);
int foo(int **mat, int m, int n)
{
    int cnt = 0;
    for (int **p = mat + 1; p < mat + m; p++)
    {
        for (int *q = *p + 1; q < *p + n; q++)
        {
            int a = *(q - 1);
            int b = *(*(p - 1) + (q - *p));
            int val = a > b ? a : b;
            if (*q < val)
            {
                *q = val;
                cnt++;
            }
            else
                *q = val + 1;
        }
    }
    return cnt;
}
int main(void)
{
    int m, n, **mat = alloc(&m, &n);
    printf("%d\n", foo(mat, m, n));
    // dealloc(mat, m);
}

// JUL 2019 - (A)* ISPITp B) iSpItP C) ispitp
// INPUT ispitP2
#include <stdio.h>
#include <ctype.h>
#define MAX 20
typedef union
{
    struct
    {
        unsigned char a, b;
    } s;
    short i;
} U;
int main(void)
{
    U arr[MAX];
    int c = 0;
    while (c < MAX && !isdigit(arr[c].s.a = getchar()))
    {
        if (islower(arr[c].s.a))
            arr[c].i = (arr[c].i & ~('a' - 'A')) << 8;
        else
            arr[c].i = (arr[c].i | ('a' - 'A')) << 8;
        c++;
    }
    for (int i = 0; i < c; i++)
        putchar(arr[i].s.b);
}

// JUL - 2019 - (A)* 1421324251 B) 5142322114 C) 515217314
//INPUT 1 1 1 3 4 4 5 2 1 3 -1
#include <stdio.h>
#include <stdlib.h>
typedef struct elem
{
    int num, cnt;
    struct elem *next;
} elem;
void add(elem **head_ptr, int num)
{
    elem *curr = *head_ptr, *prev = 0;
    for (; curr != 0 && curr->num < num; prev = curr,
                                         curr = curr->next)
        ;
    if (curr && curr->num == num)
        curr->cnt++;
    else
    {
        elem *new_elem = malloc(sizeof(elem));
        new_elem->num = num;
        new_elem->cnt = 1;
        new_elem->next = curr;
        if (prev)
            prev->next = new_elem;
        else
            *head_ptr = new_elem;
    }
}
void release_memory(elem *head);
void main()
{
    elem *h = 0;
    int num;
    while (1)
    {
        scanf("%d", &num);
        if (num <= 0)
            break;
        add(&h, num);
    }
    while (h)
    {
        printf("%d%d", h->num, h->cnt);
        h = h->next;
    }
    // release_memory(h);
}

//feb 2019 - (®)* 7 3 1 6 5 4 ®)7 6 5 4 3 1 ®)6 5 4 7 3 1
// INPUT  6 3 7 1 6 4 5
#include <stdio.h>
void fja(int *a, int n)
{
    int i, j, k, l;
    for (i = 1; i < n; i++)
    {
        k = a[i];
        for (j = (l = i) - 1;
             j >= 0 && a[j] < k; l = j--)
            a[l] = a[j];
        a[l] = k;
    }
}
void main()
{
    int *a, i, j, k, l, n, m1, m2;
    scanf("%d", &n);
    a = malloc(n * sizeof(int));
    for (i = 0; i < n; i++)
        scanf("%d", &a[i]);
    fja(a, n / 2);
    fja(a + n / 2, n / 2);
    for (i = 0; i < n; i++)
        printf("%d ", a[i]);
    free(a);
}