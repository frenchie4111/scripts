import sys


def main():

	script = sys.stdin.readlines()

	for line in script:
		sys.stdout.write( line.lower() )

	pass


if __name__ == '__main__':
	main()