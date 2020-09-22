// FEB 2020 A)9900 11 9900 754 B) 8999 00 8899 643 (C)* 9000 01 8900 644
// INPUT 1000 99 1100 356
#include <stdio.h>
int process(char *str)
{
    if (!*str)
        return 1;
    int c = process(str + 1);
    *str = '0' + '9' - *str + c;
    c = 0;
    if (*str > '9')
    {
        c = 1;
        *str = '0';
    }
    return c;
}
int main(int argc, char *argv[])
{
    for (int i = 1; i < argc; i++)
    {
        process(argv[i]);
        printf("%s ", argv[i]);
    }
    return 0;
}

// SEP 2019 - A)7.11.1867. B) 14.03.1879. (C)* 10.7.1856
//input e80ea
#include <stdio.h>
int main(int argc, char *argv[])
{
    unsigned short g, m, d;
    unsigned int v;
    if (argc < 2)
        return 1;
    sscanf(argv[1], "%x", &v);
    g = v >> 9;
    m = v >> 5 & 0x0f;
    d = v & 0x1f;
    printf("Raspakovano: %hd.%hd.%hd\n", d, m, g);
    return 0;
}

// JUN 2020 - (A)* kovid-19 2020 jun mart B) jun 2020 mart kovid-19 C) 2020 kovid-19 jun mart
//INPUT  mart jun kovid-19 2020
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
int main(int argc, char *argv[])
{
    int len = argc - 1, left = 0, right = len;
    char **str = malloc(len * sizeof(*str));
    for (int i = 1, j; i < argc; i++)
    {
        if (strlen(argv[0]) > strlen(argv[i]))
        {
            str[--right] = argv[i];
            continue;
        }
        for (j = left - 1; j >= 0; j--)
        {
            if (strcmp(str[j], argv[i]) <= 0)
                break;
            str[j + 1] = str[j];
        }
        str[j + 1] = argv[i];
        left++;
    }
    for (int i = 0; i < len; i++)
        printf("%s ", str[i]);
    free(str);
}

// JUL 2019 (A)* Oktobar2 avgusT B) Oktobar2septembar avguSt C) Oktobar2 avguSt
// input  avgust septembar oktobar oktobar2
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
int main(int argc, char *argv[])
{
    char *s1 = malloc(20 * sizeof(char));
    char *s2 = malloc(20 * sizeof(char));
    strcpy(s1, argv[4]);
    strcpy(s2, argv[1]);
    strcat(s1, argv[2]);
    *s1 += 'A' - 'a';
    s1[strlen(argv[4])] = '\0';
    s2[strlen(s2) - 1] += 'A' - 'a';
    printf("%s %s\n", s1, s2);
    return 0;
}

// jJUN 2019 - (A)* 1XrogY 1XrogY B) 1Xrog2 2progY C) 1Xrog2 1progY
// INPUT prog2 jun
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define M 10
struct jun
{
    int id;
    char *str;
};
int main(int argc, char *argv[])
{
    struct jun s1 = {1}, s2 = {2};
    s1.str = malloc(M * sizeof(char));
    strcpy(s1.str, argv[1]);
    s2.str = malloc(M * sizeof(char));
    strcpy(s2.str, argv[2]);
    s2 = s1;
    *(s1.str) = 'X';
    s2.str[strlen(s2.str) - 1] = 'Y';
    printf("%d%s %d%s\n",
           s1.id, s1.str, s2.id, s2.str);
    return 0;
}

// FEB 2019 - // OTVORI ROK - IMA  VISE REDOVA
// INPUT Januar 30ti
#include <stdio.h>
void radi(char *s)
{
    if (!*s)
        return;
    if (*s >= '0' && *s <= '9')
        radi(++s);
    else
    {
        *s += (*s >= 'a' && *s <= 'z')
                  ? 'A' - 'a'
                  : 'a' - 'A';
        radi(s += 2);
    }
}
void main(int argc, char *argv[])
{
    int i;
    for (i = 1; i < argc; i++)
    {
        radi(argv[i]);
        puts(argv[i]);
    }
}