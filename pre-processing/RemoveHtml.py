import sys
import re

######################

script = sys.stdin.readlines()

for line in script:
	line = re.sub( r'<[^>]*>', '', line ).rstrip()
	sys.stdout.write( line + '\n' )