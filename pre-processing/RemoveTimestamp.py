import sys

######################

Numbers = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ]

script = sys.stdin.readlines()

for line in script:
	if not line.lstrip().startswith( tuple( Numbers ) ):
		sys.stdout.write( line )