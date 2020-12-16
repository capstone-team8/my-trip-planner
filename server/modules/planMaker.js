function createPath(input, k){
	var places=[]
	var hotels=[]
	places = inputExtract(input)
	hotels = placeDivider_hotel(places)
	if(hotels.length==0){
		createPathWithoutHotels(input,k)
	}
	else if(hotels.length==1){
		createPathWithOneHotels(input,k)
	}
	else{
		createPathWithHotels(input,k)
	}
}
//호텔 여러개 흩어져있는것. 수정필요
function createPathWithHotels(input,k) {
	var places = []

	//숙소, 그 외 장소 분류
	var hotels = []
	var travels = []
	var distanceToHotel
	var distanceMatrix
	var clusterPath

	//hotel경로 체크용
	var path = []
	var paths = []
	var pathName = []
	var centroids = []
	var cluster = []
	var finaltmppath
	//input에서 필요한 요소들만 추출
	places = inputExtract(input)
	//장소들을 숙소와 그 외 장소들로 구분
	hotels = placeDivider_hotel(places)
	var hotelvisited = new Array(hotels.length)
	var H=hotels.length
	travels = placeDivider_tour(places)
	var T=travels.length
	var finalpath=new Array(k)

	// 호텔간 거리 매트릭스 생성
	// createDistanceMatrix(hotels)
	// 호텔간 경로 생성
	// nearestNeighbor(hotels)

	//가장 가까운 호텔 탐색 후 병합
	distanceToHotel = nearestHotel(travels, hotels)
	//centroids 초기화
	centroids = getDataRange(k, places)
	//k-means 10번 실행
	for (var i = 0; i < 10; i++) {
		cluster = getCloseCentroid(travels, centroids)
		centroids = getNewCentroid(places, cluster, centroids)
	}
	//cluster = getCloseCentroid(places, centroids)
	//클러스터간 경로 생성(centroids 기반으로 nearest neighbor 실행)
	var centroidsplaces = new Array(k)
	for (var i = 0; i < k; i++) {
		centroidsplaces[i] = []
		centroidsplaces[i].push(centroids[i])
		centroidsplaces[i].push('centroid')
		centroidsplaces[i].push(i)
	}
	//클러스터간 거리 매트릭스 생성
	distanceMatrix = createDistanceMatrix(centroidsplaces)
	//클러스터간 경로 생성
	path = nearestNeighbor(centroidsplaces, distanceMatrix)

	clusterPath = getPathName(path)
	var tmpindex
	var hotelindex
	var visitindex
	var visitcheck=0
	var pathdistance
	for(var i=0;i<k;i++){
		var tmp=100000
		for(var j=0;j<path[i].length;j++){
			for(var l=0;l<H;l++){
				visitcheck=0
				if(tmp>distanceToHotel[j][l]){
					for(var m=0;m<hotelvisited.length;m++){
						if(j==hotelvisited[m]){
							visitcheck=1
							break
						}
					}
					if(visitcheck==0){
						tmp=distanceToHotel[j][l]
						tmpindex=j
						hotelindex=l
					}
				}
			}
		}
		pathdistance=createDistanceMatrix(cluster[clusterPath[i]])
		if(i==0){
			finalpath[i]=new Array(cluster[clusterPath[i]].length+1)
			visitindex=hotelindex
		}
		else{
			finalpath[i]=new Array(cluster[clusterPath[i]].length+2)
			finalpath[i][0]=finalpath[i-1][finalpath[i-1].length-1]
			if(visitindex!=hotelindex){
				hotelvisited.push(visitindex)
				visitindex=hotelindex
			}
		}
		finaltmppath=nearestwithend(tmpindex,cluster[clusterPath[i]],pathdistance)
		if(i==0){
			for(var j=0;j<finalpath[i].length-1;j++){
				finalpath[i][j]=finaltmppath[j][2]

			}
		}
		else{
			for(var j=0;j<finalpath[i].length-2;j++){
				finalpath[i][j+1]=finaltmppath[j][2]
			}
		}
		finalpath[i][finalpath[i].length-1]=hotels[hotelindex][2]
	}

	return finalpath
}

//호텔 고려 안하고 모두 클러스터화 후 경로설정
function createPathWithoutHotels(input, k) {
	var places = []
	var distanceMatrix
	//hotel경로 체크용
	var path = []
	var paths = []
	var pathName = []
	//k-means Clustering
	var centroids = []
	var cluster = []
	var clusterPath = []
	var finalPath = []
	//input에서 필요한 요소들만 추출
	places = inputExtract(input)
	//centroids 초기화
	centroids = getDataRange(k, places)
	//k-means 10번 실행
	for (var i = 0; i < 10; i++) {
		cluster = getCloseCentroid(places, centroids)
		centroids = getNewCentroid(places, cluster, centroids)
	}
	//cluster = getCloseCentroid(places, centroids)
	//클러스터간 경로 생성(centroids 기반으로 nearest neighbor 실행)
	var centroidsplaces = new Array(k)
	for (var i = 0; i < k; i++) {
		centroidsplaces[i] = []
		centroidsplaces[i].push(centroids[i])
		centroidsplaces[i].push('centroid')
		centroidsplaces[i].push(i)
	}
	//클러스터간 거리 매트릭스 생성
	distanceMatrix = createDistanceMatrix(centroidsplaces)
	//클러스터간 경로 생성
	path = nearestNeighbor(centroidsplaces, distanceMatrix)

	clusterPath = getPathName(path)
	//경로에 따라 클러스터 재정렬 및 클러스터 내부경로 설정
	cluster = clusterRearrange(cluster, clusterPath, centroids)
	for (var i = 0; i < cluster.length; i++) {
		finalPath.push([])
		for (var j = 0; j < cluster[i].length; j++) {
			finalPath[i].push(cluster[i][j][2])
		}
	}
	return finalPath
}

//1개의 숙소
function createPathWithOneHotels(input, k) {
	var places = []
	var hotel = []
	
	//input에서 필요한 요소들만 추출
	places = inputExtract(input)
	//장소들을 숙소와 그 외 장소들로 구분
	hotel = placeDivider_hotel(places)
	places = placeDivider_tour(places)
	console.log('places')
	console.log(places)
	console.log('hotel')
	console.log(hotel)

	var c = []
	var r = []
	var dist = 0
	var inidist = new Array(places.length+1)
	var N = places.length
	var finalPath=[]

	var cdn=Math.floor(places.length/k)//클러스터 당 들어갈 장소의 개수
	var inip=0
	var temp=0
	var tempcn=0
	var iniclu=1

	var distanceMatrix
	var path = new Array(k)
	var temppoint
	var cluster=new Array(k)
	
	for(var i=0; i<places.length+1; i++){
		inidist[i]=new Array(places.length)
	}
	for (var i=0; i< places.length+1; i++){//장소간 거리 배열 생성
		for ( var j=0; j< places.length; j++){
			if(i==0){
				inidist[i][j]=Math.pow(hotel[0][0][0] - places[j][0][0], 2) + Math.pow(hotel[0][0][1] - places[j][0][1], 2)//호텔과 장소간 거리 추가
			}
			else{
				inidist[i][j]=Math.pow(places[i-1][0][0] - places[j][0][0], 2) + Math.pow(places[i-1][0][1] - places[j][0][1], 2)
			}
		}
	}
	
	for (var i = 0; i < k; i++) {
		c[i] = new Array(2)
	}
	
	while(1){//initial cluster 생성(1)
		if(tempcn>=cdn){
			tempcn=0
			iniclu=iniclu+1
			inip=0
			if(iniclu==k){
				break
			}
		}
		var inimin=100000000000
		for (var i=0; i < places.length; i++){//처음에는 호텔과 가장 가까운 장소 찾아서 클러스터에, 그 다음부터는 전에 찾은 장소와 가장 가까운 장소 클러스터로
			if(inidist[inip][i]<inimin && inidist[inip][i]>0){
				inimin=inidist[inip][i]
				temp=i
			}
		}
		r[temp]=iniclu
		inidist[inip][temp]=0
		inip=temp
		tempcn=tempcn+1
	}
	for(var i=0;i<places.length;i++){//initial cluster 생성(2)
		if(!r[i]){
			r[i]=k
		}
	}
	for(var i=0;i<N;i++){//initial cluster 생성(3)
	r[i]=r[i]-1
	}
	
	for (var i = 0; i < 3; i++) {//iteration
		var count = []
		var nc = []
		for (var j = 0; j < k; j++) {//호텔 위치 고려
			count[j] = 1
			nc[j] = new Array(2)
			nc[j][0] = hotel[0][0][0]
			nc[j][1] = hotel[0][0][1]
		}
		for (var j = 0; j < N; j++) {//c update(1) 같은 클러스터 좌표 전부 더해줌
			var clu = r[j]
			count[clu] = count[clu] + 1
			nc[clu][0] = nc[clu][0] + places[clu][0][0]
			nc[clu][1] = nc[clu][1] + places[clu][0][1]
		}
		for (var j = 0; j < k; j++) {//c update(2) 클러스터 별 노드 개수로 값 나눠줌(평균)
			nc[j][0] = nc[j][0] / count[j]
			nc[j][1] = nc[j][1] / count[j]
		}
		c = nc //c update

		for (var j = 0; j < N; j++) {//places 별 접근
			var min = 100000000000
			for (var l = 0; l < k; l++) {//places들을 가장 가까운 l-cluster로 분류
				dist = Math.pow(c[l][0] - places[j][0][0], 2) + Math.pow(c[l][1] - places[j][0][1], 2)
				if (dist < min) {
					min = dist
					r[j] = l
				}
			}
		}
	}
	
	console.log('r')
	console.log(r)
	for(var i=0;i<k;i++){
		cluster[i]=[]
	}
	for(var i=0;i<N;i++){//클러스터(r)별로 장소 배열 생성
		cluster[r[i]].push(places[i])
	}
	console.log(cluster)

	for(var i=0;i<k;i++){//클러스터내에서 경로 생성
		distanceMatrix = createDistanceMatrix(cluster[i])
		path[i] = nearestNeighbor(cluster[i], distanceMatrix)
		console.log(i)
		console.log(path[i])
	}

	for (var i=0; i<path.length; i++){//식당 고려
	var restaurantCount = 0
	var restaurantIndex = []
	var changeIndex
		for (var j=0; j<path[i].length; j++){
		if (path[i][j][1] == 'restaurant'){
			restaurantCount++
			restaurantIndex.push(j)
		}
		}
		if (restaurantCount == 1){
		changeIndex = parseInt(path[i].length/2)
		temppoint = path[i][restaurantIndex[0]]
		path[i][restaurantIndex[0]] = path[i][changeIndex]
		path[i][changeIndex] = temppoint
		}
		if (restaurantCount == 2){
		//첫번째 식당
		changeIndex = parseInt(path[i].length/2)
		temppoint = path[i][restaurantIndex[0]]
		path[i][restaurantIndex[0]] = path[i][changeIndex]
		path[i][changeIndex] = temppoint
		//두번째 식당
		changeIndex = path[i].length-1
		temppoint = path[i][restaurantIndex[1]]
		path[i][restaurantIndex[1]] = path[i][changeIndex]
		path[i][changeIndex] = temppoint
		}
		if (restaurantCount == 3){
		//첫번째 식당
		changeIndex = 1
		temppoint = path[i][restaurantIndex[0]]
		path[i][restaurantIndex[0]] = path[i][changeIndex]
		path[i][changeIndex] = temppoint
		//두번째 식당
		changeIndex = parseInt(path[i].length/2)
		temppoint = path[i][restaurantIndex[1]]
		path[i][restaurantIndex[1]] = path[i][changeIndex]
		path[i][changeIndex] = temppoint
		//세번째 식당
		changeIndex = path[i].length-1
		temppoint = path[i][restaurantIndex[1]]
		path[i][restaurantIndex[1]] = path[i][changeIndex]
		path[i][changeIndex] = temppoint
		}
	}
	
	for (var i=0; i<path.length; i++){//야경 고려
		var nightCount = 0
		var nightIndex = []
		var changeIndex
		for (var j=0; j<path[i].length; j++){
			if (path[i][j][1] == 'night'){
			nightCount++
			nightIndex.push(j)
			}
		}
		for (var j=0; j<nightCount; j++){
			changeIndex = path[i].length-1-j
			temppoint = path[i][nightIndex[i]]
			path[i][nightIndex[i]] = path[i][changeIndex]
			path[i][changeIndex] = temppoint
		}
	}

  	for (var i = 0; i < path.length; i++) {//시작점 도착점에 호텔 추가
    	finalPath.push([])
    	finalPath[i].push(hotel[0][2])
    	for (var j = 0; j < path[i].length; j++) {
      	finalPath[i].push(path[i][j][2])
      	console.log(path[i][j][2])
    	}
    	finalPath[i].push(hotel[0][2])
  	}
  	console.log(finalPath)
  	return finalPath
}

function nearestwithend(end, placeList, distanceMatrix) {
	var remaining = []
	for (var i = 0; i < placeList.length; i++) {
		remaining[i] = i
	}
	var tmp=0
	tmp=remaining[0]
	remaining[0]=remaining[end]
	remaining[end]=tmp
	var pathindex = [remaining[0]]
	var path = []
	var currentDistance
	//pathName = [places[remaining[0]][2]];
	//pathName = [hotels[[remaining[0]]][2]];
	for (var i = 0; i < placeList.length - 1; i++) {
		var nearestDistance = 1000
		var nearestPoint = null
		var remainingIndex = 0

		for (var j = i + 1; j < placeList.length; j++) {
			currentDistance = distanceMatrix[pathindex[i]][remaining[j]]
			if (currentDistance < nearestDistance) {
				nearestPoint = remaining[j]
				nearestDistance = currentDistance
				remainingIndex = j
			}
		}
		remaining = swap(remaining, i + 1, remainingIndex)
		pathindex.push(remaining[i + 1])
	}
	//index를 토대로 path 추출
	for (var i = 0; i < placeList.length; i++) {
		path[placeList.length-i-1] = placeList[pathindex[i]]
	}
	return path
}

//Nearest neighbor. path return
function nearestNeighbor(placeList, distanceMatrix) {
	var remaining = []
	for (var i = 0; i < placeList.length; i++) {
		remaining[i] = i
	}
	var pathindex = [remaining[0]]
	var path = []
	var currentDistance
	//pathName = [places[remaining[0]][2]];
	//pathName = [hotels[[remaining[0]]][2]];
	for (var i = 0; i < placeList.length - 1; i++) {
		var nearestDistance = 1000
		var nearestPoint = null
		var remainingIndex = 0

		for (var j = i + 1; j < placeList.length; j++) {
			currentDistance = distanceMatrix[pathindex[i]][remaining[j]]
			if (currentDistance < nearestDistance) {
				nearestPoint = remaining[j]
				nearestDistance = currentDistance
				remainingIndex = j
			}
		}
		remaining = swap(remaining, i + 1, remainingIndex)
		pathindex.push(remaining[i + 1])
	}
	//index를 토대로 path 추출
	for (var i = 0; i < placeList.length; i++) {
		path[i] = placeList[pathindex[i]]
	}
	return path
}
//nearest neighbor 보조용
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
	var distanceMatrix = new Array(N)
	var placevisited = new Array(N)
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
			distanceMatrix[i][j] = getDistanceBetweenLatLon(placeList[i], placeList[j])
			distanceMatrix[j][i] = distanceMatrix[i][j]
		}
	}
	//console.log(distanceMatrix);
	return distanceMatrix
}

//path의 총 거리 계(오류 있음)
function getPathLength(path) {
	var pathLength
	pathLegnth = 0
	for (var i = 1; i < path.length; i++) {
		pathLegnth += distanceMatrix[path[i - 1]][path[i]]
	}
	return pathLegnth
}

//장소 [[x,y], name, id] 형태끼리 입력
function getDistanceBetween(a, b) {
	var distance = Math.sqrt(
		(a[0][0] - b[0][0]) * (a[0][0] - b[0][0]) + (a[0][1] - b[0][1]) * (a[0][1] - b[0][1])
	)
	return distance
}

//좌표 [x,y] 형태끼리 입력
function getDistanceBetweenPoint(a, b) {
	var distance = Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]))
	return distance
}

//장소 [[x,y], name, id] 형태끼리 입력. 위도경도 기반 거리계산
function getDistanceBetweenLatLon(a, b) {
	if (a[0][0] == b[0][0] && a[0][1] == b[0][1]) {
		return 0
	} else {
		var radlat1 = (Math.PI * a[0][0]) / 180
		var radlat2 = (Math.PI * b[0][0]) / 180
		var theta = a[0][1] - b[0][1]
		var radtheta = (Math.PI * theta) / 180
		var distance =
			Math.sin(radlat1) * Math.sin(radlat2) +
			Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
		if (distance > 1) {
			distance = 1
		}
		distance = Math.acos(distance)
		distance = (distance * 180) / Math.PI
		distance = distance * 60 * 1.1515
		distance = distance * 1.609344
		return distance
	}
}

//장소들을 숙소와 여행지로 구분 (사용X)
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
//places에서 hotel만 return
function placeDivider_hotel(placeList) {
	var hotels = []
	for (var i = 0; i < placeList.length; i++) {
		if (placeList[i][1] == 'hotel') {
			hotels.push(placeList[i])
		}
	}
	return hotels
}
//tour만 return
function placeDivider_tour(placeList) {
	var travels = []
	for (var i = 0; i < placeList.length; i++) {
		if (placeList[i][1] != 'hotel') {
			travels.push(placeList[i])
		}
	}
	return travels
}

//장소들별로 가장 가까운 숙소 검색
function nearestHotel(travels, hotels) {
	var T = travels.length
	var H = hotels.length
	var distanceToHotel = new Array(T)
	var shortest = 1000
	var temp
	var shortestindex
	for (var i = 0; i < T; i++) {
		shortest = 1000
		distanceToHotel[i]= new Array(H)
		for (var j = 0; j < H; j++) {
			temp = getDistanceBetweenLatLon(travels[i], hotels[j])
			distanceToHotel[i][j]=temp
		}
	}
	return distanceToHotel
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
//경로에서 id부분 추출
function getPathName(path) {
	var pathName = []
	var temp = []
  var templength
	for (var i = 0; i < path.length; i++) {
		pathName.push(path[i][2])
    //다른 장소가 통합돼있을경우
		if (path[i].length != 3) {
      templength = path[i].length-3
			temp = path[i].slice(3)
			for (var j=0; j<path[i].length-3; j++){
        pathName.push(temp[j][2])
      }
		}
	}
	return pathName
}

//K-Means Clustering

//Initial centroid 설정 후 return
function getDataRange(k, places){
  //place를 k의 개수로 나눠서 설정
  var plength = parseInt(places.length/k)
  var xsum = 0
  var ysum = 0
  var centroid = []
  var centroids = new Array(k)
  for (var i = 0; i < k; i++) {
		centroids[i] = []
	}
  console.log(places)
  console.log(plength)
  for (var i=0; i<k; i++){
    xsum = 0
    ysum = 0
    for (var j=0; j<plength; j++){
      console.log("i")
      console.log(i)
      console.log("j")
      console.log(j)
      console.log(i*plength+j)
      xsum += places[i*plength+j][0][0]
      ysum += places[i*plength+j][0][1]
    }
    centroid = [xsum/plength, ysum/plength]
    centroids[i] = centroid
  }
  return centroids
}

//Centroid에 따른 cluster return
function getCloseCentroid(places, centroids) {
	var shortestlength
	var centroidIndex
	var templength
	var cluster = []
	for (var i = 0; i < centroids.length; i++) {
		cluster.push([])
	}
	for (var i = 0; i < places.length; i++) {
		shortestlength = getDistanceBetweenPoint(places[i][0], centroids[0])
		centroidIndex = 0
		for (var j = 1; j < centroids.length; j++) {
			templength = getDistanceBetweenPoint(places[i][0], centroids[j])
			if (templength < shortestlength) {
				shortestlength = templength
				centroidIndex = j
			}
		}
		cluster[centroidIndex].push(places[i])
	}
	return cluster
}

//Cluster에 따른 centroid return
function getNewCentroid(places, cluster, centroids) {
	var N = cluster.length
	var newCluster = []
	for (var i = 0; i < N; i++) {
		newCluster.push([])
	}
	var oldcentroids = centroids
	var xsum = 0
	var ysum = 0
	for (var i = 0; i < centroids.length; i++) {
		xsum = 0
		ysum = 0
		for (var j = 0; j < cluster[i].length; j++) {
			xsum += cluster[i][0][0][0]
			ysum += cluster[i][0][0][1]
		}
		centroids[i][0] = xsum / cluster[i].length
		centroids[i][1] = ysum / cluster[i].length
		if (cluster[i].length == 0) {
			centroids[i] = oldcentroids[i]
		}
	}
	return centroids
}

//클러스터화 이후 경로 재설정하여 새로운 cluster return
function clusterRearrange(cluster, clusterPath, centroids){

  var tempcluster = []
  var tempcentroids = []
  var tempcluster2 = []
  var preDist
  var preIndex = 0
  var postDist = 0
  var postIndex
  var tempDist
  var temppoint
  var shortestDist
  for (var i=0; i<tempcluster.length-1; i++){
    tempcluster2.push([])
    for (var j=0; j<tempcluster[i].length; j++){
      tempcluster2[i],push([])
    }
  }

  for (var i=0; i<cluster.length; i++){
    tempcluster.push(cluster[clusterPath[i]])
    tempcentroids.push(centroids[clusterPath[i]])
  }

  //클러스터의 시작점, 도착점 설정
  for (var i=0; i<tempcluster.length-1; i++){
    shortestDist = 100000
    for (var j=0; j<tempcluster[i].length; j++){
      for (var l=0; l<tempcluster[i+1].length; l++){
        tempDist = getDistanceBetweenPoint(tempcluster[i][j][0], tempcluster[i+1][l][0])
        if (tempDist < shortestDist) {
					shortestDist = tempDist
					postIndex = j
          preIndex = l
				}
      }
    }
    //현재 클러스터에서 마지막을 교체
    temppoint = tempcluster[i][postIndex]
    tempcluster[i][postIndex] = tempcluster[i][tempcluster[i].length-1]
    tempcluster[i][tempcluster[i].length-1] = temppoint
    //뒤 클러스터에서 시작점을 교체
    temppoint = tempcluster[i+1][preIndex]
    tempcluster[i+1][preIndex] = tempcluster[i+1][0]
    tempcluster[i+1][0] = temppoint
  }
	for (var i=0; i<tempcluster.length; i++){
    var insidecluster = []
    var distanceMatrix = []
    for (var j=0; j<tempcluster[i].length-1; j++){
      insidecluster[j] = tempcluster[i][j]
    }
    distanceMatrix = createDistanceMatrix(insidecluster)
    insidecluster = nearestNeighbor(insidecluster, distanceMatrix)
    for (var j=0; j<tempcluster[i].length-1; j++){
       tempcluster[i][j] = insidecluster[j]
    }
  }

  //식당 고려
  for (var i=0; i<tempcluster.length; i++){
  var restaurantCount = 0
  var restaurantIndex = []
  var changeIndex
    for (var j=0; j<tempcluster[i].length; j++){
      if (tempcluster[i][j][1] == 'restaurant'){
        restaurantCount++
        restaurantIndex.push(j)
      }
    }
    if (restaurantCount == 1){
      changeIndex = parseInt(tempcluster[i].length/2)
      temppoint = tempcluster[i][restaurantIndex[0]]
      tempcluster[i][restaurantIndex[0]] = tempcluster[i][changeIndex]
      tempcluster[i][changeIndex] = temppoint
    }
    if (restaurantCount == 2){
      //첫번째 식당
      changeIndex = parseInt(tempcluster[i].length/2)
      temppoint = tempcluster[i][restaurantIndex[0]]
      tempcluster[i][restaurantIndex[0]] = tempcluster[i][changeIndex]
      tempcluster[i][changeIndex] = temppoint
      //두번째 식당
      changeIndex = tempcluster[i].length-1
      temppoint = tempcluster[i][restaurantIndex[1]]
      tempcluster[i][restaurantIndex[1]] = tempcluster[i][changeIndex]
      tempcluster[i][changeIndex] = temppoint
    }
    if (restaurantCount == 3){
      //첫번째 식당
      changeIndex = 1
      temppoint = tempcluster[i][restaurantIndex[0]]
      tempcluster[i][restaurantIndex[0]] = tempcluster[i][changeIndex]
      tempcluster[i][changeIndex] = temppoint
      //두번째 식당
      changeIndex = parseInt(tempcluster[i].length/2)
      temppoint = tempcluster[i][restaurantIndex[1]]
      tempcluster[i][restaurantIndex[1]] = tempcluster[i][changeIndex]
      tempcluster[i][changeIndex] = temppoint
      //세번째 식당
      changeIndex = tempcluster[i].length-1
      temppoint = tempcluster[i][restaurantIndex[1]]
      tempcluster[i][restaurantIndex[1]] = tempcluster[i][changeIndex]
      tempcluster[i][changeIndex] = temppoint
    }
  }

  //야경 고려
  for (var i=0; i<tempcluster.length; i++){
    var nightCount = 0
    var nightIndex = []
    var changeIndex
      for (var j=0; j<tempcluster[i].length; j++){
        if (tempcluster[i][j][1] == 'night'){
          nightCount++
          nightIndex.push(j)
        }
      }
      for (var j=0; j<nightCount; j++){
        changeIndex = tempcluster[i].length-1-j
        temppoint = tempcluster[i][nightIndex[i]]
        tempcluster[i][nightIndex[i]] = tempcluster[i][changeIndex]
        tempcluster[i][changeIndex] = temppoint
      }
  }

  return tempcluster
}

module.exports = {
	createPath: createPath,
	createPathWithHotels: createPathWithHotels,
	createPathWithoutHotels: createPathWithoutHotels,
	createPathWithOneHotels: createPathWithOneHotels
}
