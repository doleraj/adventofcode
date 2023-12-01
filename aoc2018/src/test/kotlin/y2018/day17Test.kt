package y2018

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.io.File
import java.util.*

class day17Test {

    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals(1, day17(parseFile("y2018/day17TestInput.txt")))
    }

//    @Test
//    fun testActual() {
//        assertEquals(588, day17(parseFile("y2018/day17ActualInput.txt")))
//    }
//
//    @Test
//    fun testActualSecond() {
//        assertEquals(-1, day17Second(parseFile("y2018/day17ActualInput.txt")))
//    }
}
