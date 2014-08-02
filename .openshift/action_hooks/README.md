For information about action hooks, consult the documentation:

http://openshift.github.io/documentation/oo_user_guide.html#action-hooks

http://openshift.github.io/documentation/oo_cartridge_developers_guide.html#notes-on-script-execution
The scripts will be run directly from the home directory of the cartridge. They need to have the executable bit turned on, and they should have UNIX-friendly line endings (\n), not DOS ones (\r\n).

	chmod +x bin/*
On Windows, you can achieve this by running git update-index --chmod=+x bin/* in the cartridge directory.
