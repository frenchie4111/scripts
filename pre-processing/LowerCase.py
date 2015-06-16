import sys

##########

script = sys.stdin.readlines()

for line in script:
	sys.stdout.write( line.lower() )