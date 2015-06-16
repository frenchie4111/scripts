import sys
import re
import string

##########

script = sys.stdin.readlines()

for line in script:
	line = re.sub( '[%s]' % re.escape(string.punctuation), '', line )
	sys.stdout.write( line )

