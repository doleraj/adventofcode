package y2015.src.test.kotlin.y2015

import org.junit.Assert.*
import org.junit.Test
import y2015.day6
import java.io.File

class day6Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals(1_000_000, day6(listOf("turn on 0,0 through 999,999")))
    }

//    @Test
//    fun test2() {
//        assertEquals(true, isNice("aaa"))
//    }
//
//    @Test
//    fun test3() {
//        assertEquals(false, isNice("jchzalrnumimnmhp"))
//    }
//
//    @Test
//    fun test4() {
//        assertEquals(false, isNice("haegwjzuvuyypxyu"))
//    }
//
//    @Test
//    fun test5() {
//        assertEquals(false, isNice("dvszwmarrgswjxmb"))
//    }
//
//    @Test
//    fun testActual() {
//        assertEquals(258, day5(parseFile("y2015/day05ActualInput.txt")))
//    }
//
//    @Test
//    fun test1Second() {
//        assertEquals(true, isNiceSecond("qjhvhtzxzqqjkmpb"))
//    }
//
//    @Test
//    fun test2Second() {
//        assertEquals(true, isNiceSecond("xxyxx"))
//    }
//
//    @Test
//    fun test3Second() {
//        assertEquals(false, isNiceSecond("uurcxstgmygtbstg"))
//    }
//
//    @Test
//    fun test4Second() {
//        assertEquals(false, isNiceSecond("ieodomkazucvgmuy"))
//    }
//
//    @Test
//    fun testActualSecond() {
//        assertEquals(53, day5Second(parseFile("y2015/day05ActualInput.txt")))
//    }
}
