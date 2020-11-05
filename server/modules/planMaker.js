var places = []

//숙소, 그 외 장소 분류
var hotels = []
var travels = []
var distanceToHotel = []

//hotel경로 체크용
var path = []
var paths = []
var pathName = []
var hotelvisited = []

function createPathWithHotels(input) {
	//input에서 필요한 요소들만 추출
	places = inputExtract(input)
	//장소들을 숙소와 그 외 장소들로 구분
	placeDivider(places, hotels, travels)
	//호텔간 거리 매트릭스 생성
	createDistanceMatrix(hotels)
	//호텔간 경로 생성
	nearestNeighbor(hotels)
	//가장 가까운 호텔 탐색 후 병합
	nearestHotel(travels, hotels)
	//id 추출해서 pathName에 저장(최종 경로)
	getPathName(hotels)

	return pathName
}

function createPathWithoutHotels(input) {
	//input에서 필요한 요소들만 추출
	places = inputExtract(input)
	//장소간 거리 매트릭스 생성
	createDistanceMatrix(places)
	//장간 경로 생성
	nearestNeighbor(places)
	//경로에서 아이디 추출
	getPathName(places)

	return pathName
}

//Nearest neighbor
function nearestNeighbor(placeList) {
	var remaining = []
	for (var i = 0; i < placeList.length; i++) {
		remaining[i] = i
	}
	path = [remaining[0]]
	//pathName = [places[remaining[0]][2]];
	//pathName = [hotels[[remaining[0]]][2]];
	for (var i = 0; i < placeList.length - 1; i++) {
		var nearestDistance = 1000
		var nearestPoint = null
		var indexInRemaining = 0

		for (var j = i + 1; j < placeList.length; j++) {
			currentDistance = distanceMatrix[path[i]][remaining[j]]
			if (currentDistance < nearestDistance) {
				nearestPoint = remaining[j]
				nearestDistance = currentDistance
				remainingIndex = j
			}
		}
		remaining = swap(remaining, i + 1, remainingIndex)
		path.push(remaining[i + 1])
		//console.log(remaining[i+1])
		//console.log(places)
		//pathName.push(places[remaining[i+1]][2]);
		//pathName.push(hotels[remaining[i+1]][2]);

		//console.log(pathName);
	}
}

function swap(path, i, j) {
	var temppath = path.slice(0)
	var temp = temppath[i]
	temppath[i] = temppath[j]
	temppath[j] = temp
	return temppath
}

//거리 매트릭스 생
function createDistanceMatrix(placeList) {
	//빈 N*N matrix 생성
	var N = placeList.length
	distanceMatrix = new Array(N)
	placevisitied = new Array(N)
	for (var i = 0; i < N; i++) {
		distanceMatrix[i] = new Array(N)
	}
	//여행지간의 거리 그래프
	for (var i = 0; i < N; i++) {
		for (var j = i; j < N; j++) {
			/*
			distanceMatrix[i][j] = Math.sqrt(
				(placeList[i][0][0] - placeList[j][0][0]) * (placeList[i][0][0] - placeList[j][0][0]) +
					(placeList[i][0][1] - placeList[j][0][1]) * (placeList[i][0][1] - placeList[j][0][1])
			)
      */
			distanceMatrix[i][j] = getDistanceBetween(placeList[i], placeList[j])
			distanceMatrix[j][i] = distanceMatrix[i][j]
		}
	}
	//console.log(distanceMatrix);
}

function getPathLength(path) {
	let pathLegnth = 0
	for (var i = 1; i < path.length; i++) {
		pathLegnth += distanceMatrix[path[i - 1]][path[i]]
	}
	return pathLegnth
}

function getDistanceBetween(a, b) {
	var distance = Math.sqrt(
		(a[0][0] - b[0][0]) * (a[0][0] - b[0][0]) + (a[0][1] - b[0][1]) * (a[0][1] - b[0][1])
	)
	return distance
}

//장소들을 숙소와 여행지로 구분
function placeDivider(placeList, hotels, travels) {
	for (var i = 0; i < placeList.length; i++) {
		if (placeList[i][1] == 'hotel') {
			hotels.push(placeList[i])
			hotelvisited.push(0)
		} else if (placeList[i][1] == 'travel') {
			travels.push(placeList[i])
		}
	}
}

//장소들별로 가장 가까운 숙소 검색
function nearestHotel(travels, hotels) {
	var T = travels.length
	var H = hotels.length
	distanceToHotel = new Array(T)
	var shortest = 100
	var temp
	var shortestindex
	for (var i = 0; i < T; i++) {
		shortest = 100
		for (var j = 0; j < H; j++) {
			temp = getDistanceBetween(travels[i], hotels[j])
			if (temp < shortest) {
				shortest = temp
				shortestindex = j
				distanceToHotel[i] = hotels[j]
			}
		}
		hotels[shortestindex].push(travels[i])
		shortest = 100
	}
	console.log(hotels)
}

//input에서 필요한 정보들 추출
function inputExtract(input) {
	var N = input.length
	var places = new Array(N)
	for (var i = 0; i < N; i++) {
		places[i] = new Array(3)
		places[i][0] = new Array(2)
	}
	for (var i = 0; i < N; i++) {
		places[i][0][0] = input[i].geometry.location.lat
		places[i][0][1] = input[i].geometry.location.lng
		places[i][1] = input[i].type
		places[i][2] = input[i].place_id
	}
	return places
}

function getPathName(path) {
	var temp = []
	var templength
	for (var i = 0; i < path.length; i++) {
		pathName.push(path[i][2])
		//다른 장소가 통합돼있을경우
		if (path[i].length != 3) {
			templength = path[i].length - 3
			temp = path[i].slice(3)
			for (var j = 0; j < path[i].length - 3; j++) {
				pathName.push(temp[j][2])
			}
		}
	}
}

module.exports = {
	createPathWithHotels: createPathWithHotels,
	createPathWithoutHotels: createPathWithoutHotels
}
