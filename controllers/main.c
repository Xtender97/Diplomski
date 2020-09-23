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