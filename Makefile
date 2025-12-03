site/public/.populated: dataset/data.json dataset/metadata.json
	cp $? site/public
	touch $@
