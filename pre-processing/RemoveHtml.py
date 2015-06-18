import sys
import re


def main():
	script = sys.stdin.readlines()

	for line in script:
		line = re.sub( r'<[^>]*>', '', line ).rstrip()
		sys.stdout.write( line + '\n' )

	pass


if __name__ == '__main__':
	main()