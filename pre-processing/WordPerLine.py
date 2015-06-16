import sys
import string

###############

script = sys.stdin.read()
words = script.split()

for word in words:
	sys.stdout.write(word + '\n')
