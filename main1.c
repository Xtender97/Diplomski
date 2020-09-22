//6 4 2 3 2 1 1
#include <stdio.h>
#include <stdlib.h>
int main(int argc, char *argv[])
{
    int *array, i;
    int array [1];
    if (argc < 2)
        return 1;
    array = calloc(atoi(argv[1]), sizeof(int));
    for (i = argc - 1; i > 1; i--)
        array[atoi(argv[i])]++;
    for (i = 0; i < atoi(argv[1]); i++)
        printf("%d", array[i]);
    return 0;
}