import sys
import string


def main():
	
	script = sys.stdin.read()

	for line in script:
		line = line.replace('\n', ' ').replace('\r', '')
		sys.stdout.write( line )

	pass

if __name__ == '__main__':
	main()