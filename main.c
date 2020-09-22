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