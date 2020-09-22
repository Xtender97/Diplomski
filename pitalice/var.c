// JUN 2019  A) -4 8 B) 121 7 (C)* 59 9
#include <stdio.h>
int main()
{
    unsigned char a = 0x12;
    int b = 012;
    for (int i = 0; i < 5; i++)
    {
        switch (a + b, i)
        {
        case 2:
            a = b - a;
        case 0:
            if (b % 2)
            {
                b - 1;
                break;
            }
            b /= 2;
        case 1:
            a++;
            if (a % 2)
            {
                a++;
                continue;
            }
            break;
        default:
            if (a % 2)
            {
                a--;
            }
            b++;
        case 4:
            a = a / 2;
            break;
        }
        b++;
    }
    printf("%u %d", (unsigned)a, b);
}

// JUN 2020 - A)* 3 B) 4 C) 5
#include <stdio.h>
void main()
{
    unsigned int i = 0x18, cnt = 0;
    while (i & (i - 1))
    {
        switch (i & 03)
        {
        case 0:
            i >>= 1;
            break;
        case 1:
            i | (i + 1);
        case 2:
            i ^= 1;
            continue;
        default:
            i += 1;
        }
        cnt++;
    }
    printf("%d", cnt);
}

// AVG 2020 - A) 26 B) 16 C)30 NIJE A B ILI C NE PISE NA ROKU
#include <stdio.h>
int main(void)
{
    unsigned char x = 027, y = x;
    while (x)
    {
        switch (x-- % 3)
        {
        case 0:
            if ((y ^ 0xff) == (~y & 0xff))
                break;
            y ^= y;
        case 2:
            y--;
            continue;
        default:
            y++;
        }
        x >>= 1;
    }
    printf("%hhx", y);
}

// PORAVNI KLK 2019 -  A) -4 8 B) 121 7 (C)* 59 9 
#include <stdio.h>
int main()
{
    unsigned char a = 0x12;
    int b = 012;
    for (int i = 0; i < 5; i++)
    {
        switch (a + b, i)
        {
        case 2:
            a = b - a;
        case 0:
            if (b % 2)
            {
                b - 1;
                break;
            }
            b /= 2;
        case 1:
            a++;
            if (a % 2)
            {
                a++;
                continue;
            }
            break;
        default:
            if (a % 2)
            {
                a--;
            }
            b++;
        case 4:
            a = a / 2;
            break;
        }
        b++;
    }
    printf("%u %d", (unsigned)a, b);
}