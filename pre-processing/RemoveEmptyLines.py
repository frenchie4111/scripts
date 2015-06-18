import sys
import re


def main():
	script = sys.stdin.readlines()

	for line in script:
		if line.rstrip():
			sys.stdout.write( line )

	pass


if __name__ == '__main__':
	main()