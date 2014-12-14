getRandomInt = (min, max)->
	return Math.floor(Math.random() * (max - min)) + min

formatTime = (time)->
	mm = Math.floor(time / 60)
	hh = Math.floor(mm / 60)
	ss = Math.floor(time - mm * 60)
	if hh < 10
		hh = "0#{hh}"
	if mm < 10
		mm = "0#{mm}"
	if ss < 10
		ss = "0#{ss}"
	return "#{hh}'#{mm}'#{ss}"

# time = 121
# cc.log formatTime time