import sys
import re
import string


def main():

	script = sys.stdin.readlines()

	for line in script:
		line = re.sub( '[%s]' % re.escape(string.punctuation), '', line )
		sys.stdout.write( line )

	pass


if __name__ == '__main__':
	main()