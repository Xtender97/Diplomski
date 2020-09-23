#include <stdio.h>
int process(char *str) {
	if(!*str) return 1;
	int c = process(str + 1);
	*str = '0' + '9' - *str + c;
	c = 0;
	if(*str > '9') {
	c = 1; *str = '0';
	}
	return c;
}
int main(int argc, char *argv[]) {
	for (int i = 1; i < argc; i++) {
	process(argv[i]);
	printf("%s ", argv[i]);
	}
	return 0;
}