package y2015.src.test.kotlin.y2015

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import y2015.*
import java.io.File


class day12Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals(6, day12("""[1,2,3]"""));
    }

    @Test
    fun test2() {
        assertEquals(6, day12("""{"a":2,"b":4}"""));
    }

    @Test
    fun test3() {
        assertEquals(3, day12("""[[[3]]]"""));
    }

    @Test
    fun test4() {
        assertEquals(3, day12("""{"a":{"b":4},"c":-1}"""));
    }

    @Test
    fun test5() {
        assertEquals(0, day12("""{"a":[-1,1]}"""));
    }

    @Test
    fun test6() {
        assertEquals(0, day12("""[-1,{"a":1}]"""));
    }

    @Test
    fun test7() {
        assertEquals(0, day12("""[]"""));
    }

    @Test
    fun test8() {
        assertEquals(0, day12("""{}"""));
    }

    @Test
    fun testActual() {
        assertEquals(156366, day12(parseFile("y2015/day12ActualInput.txt")[0]))
    }

    @Test
    fun test1Second() {
        assertEquals(6, day12Second("""[1,2,3]"""));
    }

    @Test
    fun test2Second() {
        assertEquals(4, day12Second("""[1,{"c":"red","b":2},3]"""));
    }

    @Test
    fun test3Second() {
        assertEquals(0, day12Second("""{"d":"red","e":[1,2,3,4],"f":5}"""));
    }

    @Test
    fun test4Second() {
        assertEquals(6, day12Second("""[1,"red",5]"""));
    }

    @Test
    fun testActualSecond() {
        // 95729 too low
        assertEquals(96852, day12Second(parseFile("y2015/day12ActualInput.txt")[0]))
    }
}

