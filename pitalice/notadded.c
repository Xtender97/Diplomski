5)Šta ispisuje sledeći program napisan na programskom jeziku C?
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
char* transform(char*);
int main() {
 char* old = "AABBbbCabC\0";
 char* new = transform(old);
 printf("%s", new); free(new);
 return 0;
}
char* transform(char* s){
 int i = 0, j = 0;
 char* new_str = malloc(strlen(s)*2), ch;
 while(s[i] != '\0'){
 ch = s[i];
 if(isupper(ch)){
 if(i>0) new_str[j++] = ' ';
 ch = tolower(ch);
 }
 new_str[j++] = ch; i++;
 }
 new_str[j] = '\0';
 return new_str;
}

