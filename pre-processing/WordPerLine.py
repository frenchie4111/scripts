import sys
import string


def main():

	script = sys.stdin.read()
	words = script.split()

	for word in words:
		sys.stdout.write(word + '\n')

	pass


if __name__ == '__main__':
	main()