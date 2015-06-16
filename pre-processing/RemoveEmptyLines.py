import sys
import re

##########

script = sys.stdin.readlines()

for line in script:
	if line.rstrip():
		sys.stdout.write( line )